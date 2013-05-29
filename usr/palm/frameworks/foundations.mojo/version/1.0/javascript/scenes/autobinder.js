// @@@LICENSE
//
//      Copyright (c) 2009-2012 Hewlett-Packard Development Company, L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// LICENSE@@@

var AutoBinder = Class.create(Activity,
{
	_pattern: /^\$([^_]*)_(.*)($|_.*$)/,
	
	initialize: function initialize(scene, properties)
	{
		this.$super(initialize)(scene);
		this._scene = scene;
		this._bind(properties || scene);
		// Add menus if necessary
		if (this._menus)
		{
			this._menuBinder = new Menus(this._scene);
		}
	},
	
	cleanup: function cleanup()
	{
		delete this._cmds;
		if (this._menuBinder)
		{
			this._menuBinder.cleanup();
		}
		this.$super(cleanup);
	},

	_bind: function(properties)
	{
		var scene = this._scene;
		function bind(config)
		{
			return function(event)
			{
				config.func.call(scene, event);
			}
		}
		for (var name in properties)
		{
			if (name.charAt(0) == "$")
			{
				var config = this._getConfig(name, properties);
				if (config)
				{
					var typeinfo = config.typeinfo;
					if (typeinfo)
					{
						switch (typeinfo.type)
						{
							// If this is a binding to an element in the DOM, define setter/getter
							case "element":
								this._bindElementSetterGetter(config, properties);
								// If this can listen to a model, listen to it
								if (typeinfo.canlisten && config.model)
								{
									this._bindModelListener(config, properties);
								}
								break;

							// If this is an event, bind a simple event listener
							case "event":
								this.$addActivatedEventListener(config.element, config.typeinfo.event, bind(config), config.capture);
								break;
							
							// If this is binding to a scene
							case "scene":
								this.$addEventListener(this._scene.controller.sceneElement, config.typeinfo.event, bind(config), config.capture);
								break;
							
							// If this is binding to a stage
							case "stage":
								this.$addEventListener(this._scene.controller.document, config.typeinfo.event, bind(config), config.capture);
								break;

							// If this is binding to a command
							case "command":
								if (!this._cmds)
								{
									this._bindCommandHandler();
								}
								(this._cmds[config.typeinfo.event] || (this._cmds[config.typeinfo.event] = [])).push(name);
								break;
							
							case "menu":
								if (!this._menus)
								{
									this._bindCommandHandler();
								}
								this._menus[config.elementname.replace(/_/g, "-")] = name;
								break;
								
							case "fsm":
								var fsm = new Foundations.Control.FSM(config.fsm, scene);
								if (config.fsm.__events)
								{
									this._bindFSMEvents(fsm, config.fsm._events);
								}
								break;
							
							default:
								break;
						}
					}
				}
			}
		}
	},
	
	_getConfig: function(name, properties)
	{
		var val = properties[name];
		var ans = this._pattern.exec(name);
		//Mojo.Log.info("name %s ans[1] %s", name, ans[1]);
		if (ans)
		{
			var config = undefined;
			switch (ans[1])
			{
				case "command":
				case "menu":
					return this._parseConfig(name, ans[1], (ans[2] + ans[3]), val, properties);
					
				case "fsm":
					return { fsm: val };

				default:
					return this._parseConfig(name, ans[1], ans[2], val, properties);
			}
		}
		return undefined;
	},

	_parseConfig: function(name, type, elementname, config, properties)
	{
		var typeinfo = (eventMap || initEventMap())[type];
		if (typeinfo)
		{
			var elem = elementname == "document" ? this._scene.controller.document : this._scene.controller.get(elementname);
			var nconfig = { name: name, elementname: elementname, element: elem, type: type, typeinfo: typeinfo, model: undefined, path: undefined, format: undefined };
			if (config)
			{
				if (typeof config == "string")
				{
					nconfig.path = config;
					nconfig.model = properties;
				}
				else if (typeof config == "function")
				{
					nconfig.func = config;
				}
				else
				{
					nconfig.path = config.path;
					nconfig.model = config.model;
					nconfig.format = config.format;
					nconfig.attr = config.attr;
					// If we have attributes for the type, add them in
					if (nconfig.typeinfo.attr)
					{
						nconfig.attr = Object.extend(nconfig.attr || {}, nconfig.typeinfo.attr);
					}
					if (typeof nconfig.model == "string")
					{
						// If 'model' is a string, we treat it as a path to an object rooted at properties
						nconfig.model = Json.query(nconfig.model, properties);
					}
				}
			}
			return nconfig;
		}
		else
		{
			return undefined;
		}
	},

	_bindModelListener: function(config, properties)
	{
		var scene = this._scene;
		if (config.typeinfo.modelchanged)
		{
			Foundations.Model.addListener(scene, config.model, function(event)
			{
				scene.controller.modelChanged(config.model);
			});
		}
		else
		{
			var format = config.format || function(v) { return v; };
			var path = Json.query(config.path);
			Foundations.Model.addListener(scene, config.model, function(event)
			{
				var newvalue = format(path(event.model));
				if (newvalue != properties[properyname])
				{
					properties[config.name] = newvalue;
				}
			});
		}
	},

	_bindElementSetterGetter: function(config, properties)
	{
		function defineSetAndGet(setter, getter)
		{
			setter && properties.__defineSetter__(config.name, setter);
			getter && properties.__defineGetter__(config.name, getter);
		}
		var e = config.element;
		switch (config.type)
		{
			case 'element':
				properties[config.name] = e;
				break;
			
			case 'widget':
				this._scene.controller.setupWidget(config.elementname, config.attr, config.model);
				defineSetAndGet(undefined, function() { return e.mojo; });
				break;
			
			case 'html':
				defineSetAndGet(function(v) { e.innerHTML = v ? v.stripScripts() : v; }, function() { return e.innerHTML; });
				break;
		
			case 'class':
				defineSetAndGet(function(v) { e.className = v; }, function() { return e.className; });
				break;
			
			case 'show':
				defineSetAndGet(function(v) { e.style.display = v ? 'block' : 'none' }, function() { return e.style.display == 'none' ? false : true });
				break;
			
			default:
				break;
		}
	},
	
	_bindCommandHandler: function()
	{
		this._cmds = {};
		this._menus = {};
		var prevCommand = this._scene.handleCommand;
		var self = this;
		this._scene.handleCommand = function(event)
		{
			var handlers = self._cmds[event.type];
			if (handlers)
			{
				for (var i = 0; i < handlers.length; i++)
				{
					handler[i].call(self._scene, event);
				}
			}
			
			if (event.type == Mojo.Event.commandEnable)
			{
				var cmd = self._menus[event.command];
				if (cmd)
				{
					var handler = self._scene[cmd + "_enable"];
					if (handler && !handler.call(self._scene, event))
					{
						event.stopPropagation();
						event.preventDefault();
					}
					// Help is 'special' - stopPropogation to enable it
					else if (event.command == Mojo.Menu.helpCmd)
					{
						event.stopPropagation();
					}
				}
			}
			else if (event.type == Mojo.Event.command)
			{
				var cmd = self._menus[event.command];
				cmd && self._scene[cmd](event);
			}
			
			prevCommand && prevCommand.call(self._scene, event);
		}
	},
	
	_bindFSMEvents: function(fsm, events)
	{
		var self = this;
		for (var name in events)
		{
			var config = this._getConfig(name, events);
			if (config && config.typeinfo)
			{
				switch (config.typeinfo.type)
				{
					case "event":
						// Bind an DOM event which will fire an event in the state machine
						(function(name)
						{
							self.$addActivatedEventListener(config.element, config.typeinfo.event, function(event) { fsm.event(name, event); }, config.capture);
						})(config.path);
						break;
				}
			}
		}
	},
});

/*
 * Call autoRun to run the autobinder on each new scene that is created automatically.
 */
AutoBinder.autoRun = function()
{
	// Patch the AutoBinder into the scene setup/cleaup process.
	// The AutoBinder is run immediately after the default setup and immediately before the default cleanup.
	var _setup = Mojo.Controller.SceneController.prototype.setup;
	Mojo.Controller.SceneController.prototype.setup = function()
	{
		var _assistantSetup = this.assistantSetup;
		var _assistantCleanup = this.assistantCleanup;
		var binder;
		this.assistantSetup = function()
		{
			binder = new AutoBinder(this.assistant);
			_assistantSetup.call(this);
		}
		this.assistantCleanup = function()
		{
			binder.cleanup();
			_assistantCleanup.call(this);
		}
		_setup.call(this);
	}
}

exports.Scenes.AutoBinder = AutoBinder;
