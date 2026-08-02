import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source) {
  return imageBuilder.image(source);
}
