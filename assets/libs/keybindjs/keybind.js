'use strict';

var keyboard = {};


//use as execute(function() {window.close}).when(['ALT', 'F4']).match() or
//to change the this context use as: execute(function(){this.update()}).in(this).when(...
/*
	['ALT', 'EQUALS', '!DASH'] or
	"ALT + EQUALS - DASH" or "ALT + EQUALS + !DASH"
	{ALT:true, EQUALS:true, MINUS:false}
	"(ALT & F4 || (ALT & F3 & F2))"
*/

keyboard.execute = function(callback, params) {
	var context;

	var when = function(keySequence) {

		keySequence = keyboard.util.prepare.keySequence(keySequence);

		return {
			match: function() {
				if(keyboard.util.matchSequence(keySequence))
					callback.call(context || this, params);
			},
			notMatch: function() {
				if(!keyboard.util.matchSequence(keySequence))
                    callback.call(context || this, params);
			}
		};
	};

	return {
        in: function(temporaryContext) {
            context = temporaryContext;

            return {
                when: when
            };
        },
		when: when,
	};
};;'use strict';

keyboard.keypressed = {
	BACKSPACE: false,
	TAB: false,
	ENTER: false,
	SHIFT: false,
	CTRL: false,
	ALT: false,
	PAUSE: false,
	CAPS_LOCK: false,
	ESCAPE: false,
	SPACE: false,
	PAGE_UP: false,
	PAGE_DOWN: false,
	END: false,
	HOME: false,
	LEFT_ARROW: false,
	UP_ARROW: false,
	RIGHT_ARROW: false,
	DOWN_ARROW: false,
	INSERT: false,
	DELETE: false,
	KEY_0: false,
	KEY_1: false,
	KEY_2: false,
	KEY_3: false,
	KEY_4: false,
	KEY_5: false,
	KEY_6: false,
	KEY_7: false,
	KEY_8: false,
	KEY_9: false,
	KEY_A: false,
	KEY_B: false,
	KEY_C: false,
	KEY_D: false,
	KEY_E: false,
	KEY_F: false,
	KEY_G: false,
	KEY_H: false,
	KEY_I: false,
	KEY_J: false,
	KEY_K: false,
	KEY_L: false,
	KEY_M: false,
	KEY_N: false,
	KEY_O: false,
	KEY_P: false,
	KEY_Q: false,
	KEY_R: false,
	KEY_S: false,
	KEY_T: false,
	KEY_U: false,
	KEY_V: false,
	KEY_W: false,
	KEY_X: false,
	KEY_Y: false,
	KEY_Z: false,
	LEFT_META: false,
	RIGHT_META: false,
	SELECT: false,
	NUMPAD_0: false,
	NUMPAD_1: false,
	NUMPAD_2: false,
	NUMPAD_3: false,
	NUMPAD_4: false,
	NUMPAD_5: false,
	NUMPAD_6: false,
	NUMPAD_7: false,
	NUMPAD_8: false,
	NUMPAD_9: false,
	MULTIPLY: false,
	ADD: false,
	SUBTRACT: false,
	DECIMAL: false,
	DIVIDE: false,
	F1: false,
	F2: false,
	F3: false,
	F4: false,
	F5: false,
	F6: false,
	F7: false,
	F8: false,
	F9: false,
	F10: false,
	F11: false,
	F12: false,
	NUM_LOCK: false,
	SCROLL_LOCK: false,
	SEMICOLON: false,
	EQUALS: false,
	COMMA: false,
	DASH: false,
	PERIOD: false,
	FORWARD_SLASH: false,
	GRAVE_ACCENT: false,
	OPEN_BRACKET: false,
	BACK_SLASH: false,
	CLOSE_BRACKET: false,
	SINGLE_QUOTE: false,
};

;'use strict';

keyboard.keys = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	PAUSE: 19,
	CAPS_LOCK: 20,
	ESCAPE: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,
	INSERT: 45,
	DELETE: 46,
	KEY_0: 48,
	KEY_1: 49,
	KEY_2: 50,
	KEY_3: 51,
	KEY_4: 52,
	KEY_5: 53,
	KEY_6: 54,
	KEY_7: 55,
	KEY_8: 56,
	KEY_9: 57,
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	LEFT_META: 91,
	RIGHT_META: 92,
	SELECT: 93,
	NUMPAD_0: 96,
	NUMPAD_1: 97,
	NUMPAD_2: 98,
	NUMPAD_3: 99,
	NUMPAD_4: 100,
	NUMPAD_5: 101,
	NUMPAD_6: 102,
	NUMPAD_7: 103,
	NUMPAD_8: 104,
	NUMPAD_9: 105,
	MULTIPLY: 106,
	ADD: 107,
	SUBTRACT: 109,
	DECIMAL: 110,
	DIVIDE: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUM_LOCK: 144,
	SCROLL_LOCK: 145,
	SEMICOLON: 186,
	EQUALS: 187,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190,
	FORWARD_SLASH: 191,
	GRAVE_ACCENT: 192,
	OPEN_BRACKET: 219,
	BACK_SLASH: 220,
	CLOSE_BRACKET: 221,
	SINGLE_QUOTE: 222
};;'use strict';

keyboard.util = {
	getKeyByValue: function(value) {
		var key;

		for(key in keyboard.keys) {
			if(keyboard.keys[key] == value)
				return key;
		}
		throw("Key not found for value: " + value);
	},
	matchSequence: function(keySequence) {
		var objectKey, key;

		for(key in keySequence) {
			objectKey = {key:key, value:keySequence[key]};

			if(!keyboard.util.matchKey(objectKey))
				return false;
		}
		return true;
	},
	matchKey: function(objectKey) {
		return keyboard.keypressed[objectKey.key] == objectKey.value;
	},
	isNotKey: function(stringKey) {
		return (typeof stringKey == "string" && stringKey[0] == "!");
	}
};;'use strict';

keyboard.util.prepare = {
	keySequence: function(keySequence) {
		if(keySequence instanceof Object)
			return keySequence;

		if(keySequence instanceof Array)
			return keyboard.util.prepare.keySequenceAsArray(keySequence);

		if(typeof keySequence == "string") {
			return keyboard.util.prepare.keySequenceAsString(keySequence);
		}

		throw("Uknow type \"" + typeof keySequence + "\" for key sequence: " + keySequence);
	},
	keySequenceAsString: function(keySequence) {
		var keys = keySequence.split("+");

		keys = keys.map(function(key) {
			return key.trim();
		});

		return keyboard.util.prepare.keySequenceAsArray(keys);
	},
	keySequenceAsArray: function(keySequence) {
		var objectKeySequence = {},
			key, value,
			i;

		for(i=0; i<keySequence.length; i++) {
			key = keySequence[i];
			value = true;

			if(keyboard.util.isNotKey(keySequence[i])) {
				key = keyboard.util.prepare.notKey(key);
				value = false;
			}

			objectKeySequence[key] = value;
		}

		return objectKeySequence;
	},
	notKey: function(stringKey) {
		return stringKey.slice(1);
	},
};

;'use strict';

keyboard.util.set = {
	keyDown: function(which) {
		keyboard.util.set.keyState(which, true);
	},
	keyUp: function(which) {
		keyboard.util.set.keyState(which, false);
	},
	keyState: function(which, booleanState) {
		var key = keyboard.util.getKeyByValue(which);

		keyboard.keypressed[key] = booleanState;
	},
};