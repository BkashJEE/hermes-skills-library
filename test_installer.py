import unittest
import yaml
from install import enable_in_config, NAME

class InstallerTest(unittest.TestCase):
    def test_preserves_settings_and_comments(self):
        for original in ('# Keep this\nmodel: example\n', 'plugins: {}\nmodel: example\n',
                         'plugins:\n  enabled: [existing]\n  extra: true\nmodel: example\n',
                         'plugins: {enabled: [existing], extra: true}\nmodel: example\n'):
            updated = enable_in_config(original)
            old = yaml.safe_load(original)
            new = yaml.safe_load(updated)
            self.assertEqual(new['model'], old['model'])
            self.assertIn(NAME, new['plugins']['enabled'])
            if '# Keep this' in original:
                self.assertIn('# Keep this', updated)
            self.assertEqual(enable_in_config(updated), updated)
    def test_explicit_disable_and_malformed_config_rejected(self):
        for text in (f'plugins:\n  disabled: [{NAME}]', 'plugins: nope', 'plugins: {enabled: nope}', '[not, a, mapping]'):
            with self.assertRaises(ValueError): enable_in_config(text)

if __name__ == '__main__': unittest.main()
