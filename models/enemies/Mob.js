class Mob {
  #tier;
  #health;
  #castingResource;
  #power;
  #preparedness;
  constructor(tier) {
    this.#tier = tier;
    this.#health = 50 + tier * 10;
    this.#castingResource = 20 + tier * 5;
    this.#power = 10 + tier * 3;
    this.#preparedness = 5 + tier * 2;
  }
 // Getters
 get tier() {
  return this.#tier;
}

get health() {
  return this.#health;
}

get castingResource() {
  return this.#castingResource;
}

get power() {
  return this.#power;
}

get preparedness() {
  return this.#preparedness;
}

// Setters
set health(value) {
  if (value >= 0) {
    this.#health = value;
  } else {
    console.warn("Health cannot be negative.");
  }
}

// Methods
skill1() {
  return `${this.constructor.name} uses Skill1!`;
}

skill2() {
  return `${this.constructor.name} uses Skill2!`;
}

skill3() {
  return `${this.constructor.name} uses Skill3!`;
}
}

class Tier1Mob extends Mob {
  constructor() {
    super(1);
    this.health += 5;
  }

  skill1() {
    return 'Tier 1 Mob uses a weak attack!';
  }
}

class Tier2Mob extends Mob {
  constructor() {
    super(2);
    this.health += 20;
  }

  skill2() {
    return 'a strong attack!';
  }
}

class Tier3Mob extends Mob {
  constructor() {
    super(3);
    this.health += 50;
  }

  skill2() {
    return 'a stronger attack!';
  }
}

class Tier4Mob extends Mob {
  constructor() {
    super(4);
    this.health += 100;
  }

  skill2() {
    return 'powerful attack!';
  }
}

class Tier5Mob extends Mob {
  constructor() {
    super(5);
    this.health += 200;
  }

  skill2() {
    return 'devastating attack!';
  }
}

class Tier6Mob extends Mob {
  constructor() {
    super(6);
    this.health += 400;
  }

  skill2() {
    return 'fearsome attack!';
  }
}

class Tier7Mob extends Mob {
  constructor() {
    super(7);
    this.health += 600;
  }

  skill2() {
    return 'brutal attack!';
  }
}

class Tier8Mob extends Mob {
  constructor() {
    super(8);
    this.health += 1000;
  }

  skill2() {
    return 'destructive attack!';
  }
}

class Tier9Mob extends Mob {
  constructor() {
    super(9);
    this.health += 5000;
  }

  skill2() {
    return 'overwhelming attack!';
  }
}

class Tier10Mob extends Mob {
  constructor() {
    super(10);
    this.health += 10000;
  }

  skill2() {
    return 'annihilating attack!';
  }
}

export { Mob, Tier1Mob, Tier2Mob, Tier3Mob, Tier4Mob, Tier5Mob, Tier6Mob, Tier7Mob, Tier8Mob, Tier9Mob, Tier10Mob };
