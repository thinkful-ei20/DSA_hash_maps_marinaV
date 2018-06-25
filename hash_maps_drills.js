class HashMap{
  constructor(initCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initCapacity;
    this._deleted = 0;
  }

  // convert string into a number
  static _hashString(string) {
    // console.log('string', string);
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      // console.log('chartCodeAt', string.charCodeAt(i));
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    // console.log('hashString return', hash >>> 0);
    return hash >>> 0;

  }

  //
  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error ('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    // increase length count if the slot does not contain data
    if (!this._slots[index]) {
      this.length++;
    }

    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    // this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error ('Key error');
    }
    slot.deleted = true;
    this.length++;
    this._deleted++;
  }

  // call _hashString() to calc the hash of the key
  // find correct slot
  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    // iterate over an array to look for a matching key
    // or and empty slot
    // NOTE: array will always have an available slot
    // due to MAX_LOAD_RATION
    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];

      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length
    // It will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }
}

HashMap.MAX_LOAD_RATIO = 0.7;
HashMap.SIZE_RATIO = 3;


// given a string, determine if a permutation of the string could form a palindrome
const isPalindrome = (str) => {
  if (!str.length) {
    console.log('Unable to return a value: string should contain at least 3 characters');
    return;
  }

  // create hash table to store data
  const data = new HashMap();

  // iterate over each character in the string
  for (let i = 0; i < str.length; i++) {
    // if key already exists in the table, get number of counts stored in value property
    // increment count by 1 and update slot with the new object containing updated count
    try {
      let value = data.get(str.charAt(i));
      value++;
      data.set(str.charAt(i), value)
    }
    // create a new entry in the map table for each unique character with the number of occurrences as 1
    catch (e) {
      data.set(str.charAt(i), 1);
    }
  }

  let count = 0;

  // iterate over each slot finding value containing odd number of occurrences
  // increase count by 1 for each odd value
  for (const slot of data._slots) {
    // skip slots that has no data
    if (slot && !slot.deleted) {
      console.log(slot.value);
      count += slot.value % 2;
    }
  }

  // return true if string is an even length and count is an even number
  if (str.length % 2 && count % 2) {
    console.log(`The ${str} string is a palindrome`);
    return true;
  }
  // return true if string is an odd length and count is an odd number
  else if (!(str.length % 2) && !(count % 2)){
    console.log(`The ${str} string is a palindrome`);
    return true;
  }
  // return false for all other cases
  else {
    console.log(`The ${str} string is NOT a palindrome`);
    return false;
  }
};

console.log(isPalindrome("noon"));

const main = () => {
  const lor = new HashMap();
  lor.set("Hobbit", "Bilbo");
  lor.set("Hobbit", "Frodo");
  lor.set("Wizard", "Gandolf");
  lor.set("Human", "Aragon");
  lor.set("Elf", "Legolas");
  lor.set("Maiar", "The Necromancer");
  lor.set("Maiar", "Sauron");
  lor.set("RingBearer", "Gollum");
  lor.set("LadyOfLight", "Galadriel");
  lor.set("HalfElven", "Arwen");
  lor.set("Ent", "Treebeard");

  console.log(lor.get("Maiar"));



  return lor;
};

// console.log(main());

