import Multiton from './Multiton.js';

class QuickCommand extends Multiton {
	static table = 'commands';
	static fields = {
	    keys: "",
	    effect: "",
	    name: ""
	};
}

export default QuickCommand;