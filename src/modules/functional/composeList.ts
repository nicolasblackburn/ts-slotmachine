import { reduce } from "./reduce";
import { compose } from "./compose";
import { id } from "./id";

export const composeList = reduce(compose, id);