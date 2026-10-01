"""An upload must not depend on the file's name being ASCII.

secure_filename() drops every character it does not trust. A name made only
of such characters -- "фото.jpg", "写真.png", a photo saved under an emoji --
comes back as just "jpg": the dot is gone with the rest of it. Reading the
extension off that with rsplit('.', 1)[1] raises IndexError, and the callers
only catch ValueError and RuntimeError, so it escaped as a 500 and the post
went with it.

This is why some photos uploaded and some did not, with nothing obviously
different about them.
"""
import io
import unittest
from unittest.mock import patch

from werkzeug.datastructures import FileStorage

import app as zapp

# Names that survive sanitising, and names that do not.
SAFE_NAMES = ["IMG_1234.jpg", "cicek.png", "Ş.jpeg", "ğüşiöç.png", "photo 1.webp"]
STRIPPED_NAMES = ["фото.jpg", "写真.png", "😀.jpg", "사진.jpeg", "صورة.png"]


def file_for(name):
    return FileStorage(stream=io.BytesIO(b"not really an image, but bytes"),
                       filename=name, content_type="image/jpeg")


class ExtensionFromAnyNameTests(unittest.TestCase):
    """The helper reads the extension without tripping over the name."""

    def test_a_name_that_survives_sanitising(self):
        for name in SAFE_NAMES:
            with self.subTest(filename=name):
                expected = name.rsplit('.', 1)[1].lower()
                self.assertEqual(
                    zapp.media_extension(name, zapp.ALLOWED_IMAGE_EXTENSIONS),
                    expected)

    def test_a_name_that_sanitising_strips_to_nothing(self):
        for name in STRIPPED_NAMES:
            with self.subTest(filename=name):
                expected = name.rsplit('.', 1)[1].lower()
                self.assertEqual(
                    zapp.media_extension(name, zapp.ALLOWED_IMAGE_EXTENSIONS),
                    expected)

    def test_an_extension_we_do_not_allow_is_still_refused(self):
        """The original name is consulted for the extension only, and only
        when that extension is one we already accept."""
        for name in ("script.exe", "фото.exe", "archive.zip", "noextension"):
            with self.subTest(filename=name):
                with self.assertRaises(ValueError):
                    zapp.media_extension(name, zapp.ALLOWED_IMAGE_EXTENSIONS)

    def test_it_raises_the_kind_of_error_callers_catch(self):
        """IndexError escaped as a 500; ValueError reaches the reader as a
        message and keeps them on the page."""
        with self.assertRaises(ValueError):
            zapp.media_extension("фото.exe", zapp.ALLOWED_IMAGE_EXTENSIONS)


class UploadDoesNotCrashOnTheNameTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True)

    def upload(self, name):
        # No Supabase: the local branch is taken, which is enough to prove the
        # name no longer decides whether the call survives.
        with patch.object(zapp, 'supabase', None), \
             zapp.app.test_request_context('/'):
            return zapp.upload_image_to_storage(file_for(name), 'posts/1')

    def test_every_name_uploads(self):
        for name in SAFE_NAMES + STRIPPED_NAMES:
            with self.subTest(filename=name):
                url = self.upload(name)
                self.assertTrue(url)
                self.assertTrue(url.endswith(name.rsplit('.', 1)[1].lower()))

    def test_a_disallowed_type_is_refused_before_anything_is_written(self):
        with self.assertRaises(ValueError):
            self.upload("payload.exe")


if __name__ == '__main__':
    unittest.main()
