/**
 * Every component part will need to export data in JSON format 
 * this is done so as to make it possible to implement consistent 
 * ui representation of the hardware
 */

class Part {
  constructor (params) {
    this.id = params.id;

    this.children = []; // collecting any dependant children
  }

  attachChildren (...children) {
    this.children.push (...children);
  }

  toJSON () {
    // returns a JSON state object
    // summarising the information
    return {
      id: this.id,
      state: this.getLocalState (),
      type: this.getPartType (),
      children: this.children.map (child => {
        return child.toJSON ();
      }),
    };
  }

  getChild (id) {
    return this.children.find (e => e.id === id);
  }

  getLocalState () {
    // throw new Error (this.id + '.getLocalState() is not implemented');

    return null;
  }

  getPartType () {
    if (!this.type) {
      throw new Error (
        this.id + ' part must explicitely specify its type in the constructor'
      );
    }
    return this.type;
  }
}

module.exports = Part;
