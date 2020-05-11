import Model from "./Model.js";
class Rod extends Model {
}
Model.table = "rods";
Model.fields = {
    name: 0,
    description: "",
    quality: "",
    price: 0,
    time_min: 0,
    time_max: 0,
    chance_common: 0,
    chance_uncommon: 0,
    chance_rare: 0,
    chance_epic: 0,
    chance_legendary: 0,
    chance_mythic: 0,
    chance_forgotten: 0,
};
export default Rod;
