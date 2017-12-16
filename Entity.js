function Entity(name, hp) {
    this.id = 0;
    this.owner = null;
    this.name = name;
    this.hp = hp;
    this.level = 1;
    this.atk = 1;
    this.def = 1;
    this.exp = 0;
    this.dropExp = 0;
    this.inventory = [];
    this.alive = true;
    this.active = false;
    this.weapon = null;
    this.armed = false;
    this.roll = 1;
}

Entity.prototype.setDropExp = function(exp) {
  this.dropExp = exp;  
};

Entity.prototype.nextLevel = function(level) {
    var base_xp = 50;
    var factor = 0.01;
    return  base_xp * (level ^ factor);
};

Entity.prototype.rollDice = function() {
    var roll = getRandomInt(1,7);
    return roll;
};

Entity.prototype.give = function(target,item) {
    var id = this.getItemIndex(item);
    var i = this.inventory[id];
    target.addItem(i);
    this.removeItem(i);
    
};

Entity.prototype.loot = function(target) {
    var inv = target.inventory;
    for(var i=0;i < inv.length;i++) {
        var item = inv[i];
        target.give(this,item);
        i--;
    }
};

Entity.prototype.inspect = function(target) {
    target.displayInfo("hp");
    target.displayInfo("attack");
    target.displayInfo("def");
};

Entity.prototype.heal = function(amt) {
    this.hp += amt;
};

Entity.prototype.reset = function() {
    this.hp = 100;
    this.active = false;
    this.alive = true;
};

Entity.prototype.hit = function(amt) {
    this.hp -= amt;
};

Entity.prototype.setAttack = function(atk) {
    this.atk = atk;
};

Entity.prototype.setDefense = function(def) {
    this.def = def;
};

Entity.prototype.setWeapon = function(wep) {
    this.weapon = wep;
};

Entity.prototype.setExp = function(exp) {
    this.exp = exp;
};

Entity.prototype.levelUp = function() {
    var goal = this.nextLevel(this.level + 1);
    if(this.exp >= goal) {
        this.level++;
    }
};

Entity.prototype.addItem = function(item) {
    item.setOwner(this);
    this.inventory.push(item);
};

Entity.prototype.kill = function() {
    this.hp = 0;
    this.alive = false;
    this.active = false;
};

Entity.prototype.removeItem = function(item) {
    var i = this.getItemIndex(item);
    if (i > -1) {
         this.inventory.splice(i, 1);
    }
};

Entity.prototype.disarm = function() {
    this.weapon = null;
    this.armed = false;
};

Entity.prototype.arm = function(wep) {
    this.weapon = wep;
    this.armed = true;
};

Entity.prototype.hasItem = function(item) {
    var i = this.inventory.indexOf(item);
    return i > -1;
};

Entity.prototype.getItemIndex = function(item) {
    return this.inventory.indexOf(item);
};

Entity.prototype.addExp = function(exp) {
  this.exp += exp;  
};

Entity.prototype.attack = function(target) {
    var wep = this.weapon ? this.weapon.damage : 0;
    var atk = (this.atk + wep) + this.rollDice();
    if(atk > 0) {
        console.log(this.name + " attacks " + target.name + " for " + atk);
        target.hit(atk);
    } else {
        console.log(this.name + " attacks " + target.name + ",for 1");
        target.hit(1);
    }
    if(target.hp <= 0) {
        return true;
    }
};


Entity.prototype.isAlive = function() {
    return this.alive;
};

Entity.prototype.update = function() {
    if (this.hp <= 0) {
        this.kill();
        return;
    }
    this.levelUp();
};

Entity.prototype.info = function() {
    console.log("---");
    console.log('Entity:' + this.name);
    console.log('HP:' + this.hp);
    console.log("Exp:" + this.exp + "/" + this.nextLevel(this.level+1));
    console.log("Base Attack:" + this.atk);
    console.log("Base Defense:" + this.def);
    console.log("Level:" + this.level);
    console.log('Alive:' +  this.isAlive());
    console.log("Weapon: " + (this.weapon ? this.weapon.damage : "N/A"));
    console.log("Inventory: " + this.inventory.length);
    for(var i=0;i < this.inventory.length;i++) {
        console.log(i+") " + this.inventory[i].name + " [ " + this.inventory[i].owner.name);
    }
    console.log("");
};

Entity.prototype.displayInfo = function(info) {
    switch(info) {
        case "hp":
            console.log("HP " + this.hp);
        break;
        
        case "attack":
            console.log("Base Attack " + this.atk);
        break;
        
        case "defense":
            console.log("Base Defense " + this.def);
        break;
        
        case "level":
            console.log("Level " + this.level);
        break;
        
        case "exp":
            console.log("Exp " + this.exp + "/" + this.nextLevel(this.level+1));
        break;
    }
};

Entity.prototype.infoExpCurve = function() {
    for(var i=1;i < 99;i++) {
        console.log(i + ") To next level " + this.nextLevel(i));
    }
};