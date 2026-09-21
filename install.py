"""Install the desktop/backend pair with explicit profile selection and backups."""
import argparse
import json
from pathlib import Path
import shutil
import time
import yaml

NAME = 'hermes-skills-library'


def enable_in_config(text):
    """Preserve comments and unrelated settings; reject unsupported YAML shapes."""
    data = yaml.safe_load(text) or {}
    if not isinstance(data, dict):
        raise ValueError('Profile config must be a YAML mapping')
    section = data.get('plugins') or {}
    if not isinstance(section, dict):
        raise ValueError('plugins must be a YAML mapping')
    enabled = section.get('enabled') or []
    disabled = section.get('disabled') or []
    if not isinstance(enabled, list) or not isinstance(disabled, list):
        raise ValueError('Plugin enabled/disabled settings must be lists')
    if NAME in disabled:
        raise ValueError('This profile explicitly disables the library; enable it in Hermes first')
    if NAME in enabled:
        return text
    enabled = [*enabled, NAME]
    node = yaml.compose(text)
    plugin_node = next((v for k, v in node.value if k.value == 'plugins'), None) if node else None
    if plugin_node:
        if not isinstance(plugin_node, yaml.MappingNode):
            raise ValueError('plugins must be a YAML mapping')
        enabled_node = next((v for k, v in plugin_node.value if k.value == 'enabled'), None)
        if enabled_node:
            old = text[enabled_node.start_mark.index:enabled_node.end_mark.index]
            replacement = json.dumps(enabled) + ('\n' if old.endswith('\n') else '')
            text = text[:enabled_node.start_mark.index] + replacement + text[enabled_node.end_mark.index:]
        elif plugin_node.flow_style:
            replacement = json.dumps({**section, 'enabled': enabled})
            text = text[:plugin_node.start_mark.index] + replacement + text[plugin_node.end_mark.index:]
        else:
            key = next(k for k, v in node.value if k.value == 'plugins')
            index = text.index('\n', key.start_mark.index) + 1
            text = text[:index] + '  enabled: ' + json.dumps(enabled) + '\n' + text[index:]
    else:
        text = text.rstrip() + '\nplugins:\n  enabled: ' + json.dumps(enabled) + '\n'
    if yaml.safe_load(text) != {**data, 'plugins': {**section, 'enabled': enabled}}:
        raise ValueError('Config preservation check failed; no files changed')
    return text


def main():
    from hermes_constants import get_default_hermes_root
    from hermes_cli.profiles import list_profiles
    parser = argparse.ArgumentParser(description=__doc__)
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument('--profile', action='append', default=[], help='Existing profile to enable (repeatable)')
    selection.add_argument('--all-profiles', action='store_true', help='Explicitly enable in all existing profiles')
    parser.add_argument('--dry-run', action='store_true', help='Validate and show planned paths without writes')
    args = parser.parse_args()
    source = Path(__file__).resolve().parent
    home = get_default_hermes_root()
    available = {p.name: p for p in list_profiles()}
    names = list(available) if args.all_profiles else args.profile
    missing = set(names) - available.keys()
    if missing:
        parser.error('Unknown profiles: ' + ', '.join(sorted(missing)))
    configs = []
    for name in names:
        config = available[name].path / 'config.yaml'
        if config.is_symlink():
            raise ValueError('Refusing a symlink profile config')
        text = config.read_text() if config.exists() else ''
        updated = enable_in_config(text)
        if text != updated:
            configs.append((name, config, updated))
    backend = home / 'plugins' / NAME
    frontend = home / 'desktop-plugins' / NAME
    for dest in (backend, frontend):
        if dest.is_symlink() or (dest.exists() and not dest.is_dir()):
            raise ValueError('Installation destination must be a regular directory: ' + str(dest))
    plan = {'backend': str(backend), 'desktop': str(frontend), 'enable_profiles': names,
            'dry_run': args.dry_run}
    if args.dry_run:
        print(json.dumps(plan, indent=2))
        return
    backup = home / 'backups' / (NAME + '-' + time.strftime('%Y%m%d-%H%M%S') + '-' + str(time.time_ns()))
    backup.mkdir(parents=True, mode=0o700)
    for dest in (backend, frontend):
        if dest.exists():
            shutil.copytree(dest, backup / dest.parent.name / NAME)
        dest.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source / 'plugin.yaml', backend / 'plugin.yaml')
    shutil.copytree(source / 'dashboard', backend / 'dashboard', dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns('__pycache__', 'sources.local.json'))
    shutil.copy2(source / 'desktop/plugin.js', frontend / 'plugin.js')
    for filename in ('LICENSE', 'THIRD_PARTY_NOTICES.md'):
        shutil.copy2(source / filename, frontend / filename)
    for name, config, updated in configs:
        if config.exists():
            shutil.copy2(config, backup / (name + '-config.yaml'))
        temporary = config.with_name(config.name + '.library-tmp')
        temporary.write_text(updated)
        temporary.chmod(0o600)
        temporary.replace(config)
    print(json.dumps({**plan, 'backups': str(backup)}, indent=2))
    print('Reopen Hermes Desktop. If no profile was selected, enable hermes-skills-library in Hermes first.')


if __name__ == '__main__':
    main()
