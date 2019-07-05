class Team {
    constructor(name, shortName, color, flag, description) {
        this.name = name;
        this.shortName = shortName;
        this.color = color;
        this.flag = flag;
        this.description = description;
    }

    static create(name, shortName, color, flag, description) {
        return new Team(name, shortName, color, flag);
    }
}