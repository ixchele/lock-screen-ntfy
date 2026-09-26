/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St, Gio, GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const _ = ExtensionUtils.gettext;

const Indicator = GObject.registerClass(
	class Indicator extends PanelMenu.Button {
		_init() {
			super._init(0.0, _('ft_log'));

			this.add_child(new St.Icon({
				icon_name : 'system-lock-screen-symbolic.symbolic',
				style_class: 'system-status-icon',
			}));
			this.connect('button-press-event', () => {
				try {
					// <- Remplacement du chemin ici
					let scriptFile = Me.dir.get_child('ft-log');
					let scriptPath = scriptFile.get_path();
					
					let cmd = ['/usr/bin/bash', scriptPath];

					let proc = Gio.Subprocess.new(cmd, Gio.SubprocessFlags.NONE);
					proc.wait_check(null);

				} catch (e) {
					let err = ['/usr/bin/notify-send', "ft_log", `[x] Error while running ft_log : ${e.message}`]
					Gio.Subprocess.new(err, Gio.SubprocessFlags.NONE);
					//
					global.logError('[x] Error while running ft_log : ' + e.message);
				}
			});
		}
	});

class Extension {
	constructor(uuid) {
		this._uuid = uuid;

		ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
	}

	enable() {
		this._indicator = new Indicator();
		Main.panel.addToStatusArea(this._uuid, this._indicator);
	}

	disable() {
		this._indicator.destroy();
		this._indicator = null;
	}
}

function init(meta) {
	return new Extension(meta.uuid);
}
