import { Avatar, AvatarGroup } from "@chakra-ui/react";

const avatars = [
  {
    name: "AK",
  },
  {
    name: "CT",
  },
  {
    name: "KS",
  },
  {
    name: "VK",
  },
];

function AvatarRow({ avatarSize = "sm" }) {
  return (
    <AvatarGroup>
      {avatars.map((avatar) => (
        <Avatar
          key={avatar.name}
          name={avatar.name}
          src={avatar.name}
          size={avatarSize}
          position="relative"
          zIndex={2}
          _before={{
            content: '""',
            width: "full",
            height: "full",
            rounded: "full",
            transform: "scale(1.125)",
            // bgGradient: "linear(to-bl, green.400,green.500)",
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
          }}
        />
      ))}
    </AvatarGroup>
  );
}

export default AvatarRow;
