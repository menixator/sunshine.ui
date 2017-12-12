class Repository {
  constructor(opts) {
    let { dataPool, meta } = opts;

    this.meta = meta;

    if (opts.meta.singular) {
      this.plants = new Map();
      this.plants.set(opts.plant.oid, opts.plant);
      this.dataPool = new Map();

      dataPool.forEach(entry => {
        let [timestamp, value] = entry;

        this.dataPool.set(timestamp, [
          {
            oid: opts.plant.oid,
            value
          }
        ]);
      });
    } else {
      this.plants = new Map(opts.plants);
      this.dataPool = new Map(dataPool);
    }

    for (let plant of this.plants.values()) {
      plant.name = plant.name.replace(/dhiraagu\s*,\s*/gi, "").trim();
    }
  }

  humanize(value) {

    if (value < 1 && value > 0) {
      return parseFloat(value.toFixed(4), 10);
    }

    return parseFloat(value.toFixed(2), 10);
  }

  get unit() {
    switch (this.meta.type) {
      case "co2-avoided":
        return "kg";
      default:
    }
    return this.meta.unit;
  }

  plantName(oid) {
    return this.plants.get(oid).name;
  }

  plantNames() {
    return Array.from(this.plants.values()).map(plant => plant.name);
  }

  get empty() {
    return this.dataPool.size === 0;
  }
}

export default Repository;
