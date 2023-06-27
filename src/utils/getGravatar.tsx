import { getGravatarUrl, type GravatarOptions } from "react-awesome-gravatar";

const GravatarOption: GravatarOptions = {
  size: 50,
  default: "retro",
};
export default function getGravatar(content: string | undefined) {
  return getGravatarUrl(content || "", GravatarOption);
}
