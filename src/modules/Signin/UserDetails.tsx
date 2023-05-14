import { Button } from "@/modules/ui/button";
import { type SectionMapKeys, type SigninOptions } from "@/pages/signin";
import getGravatar from "@/utils/getGravatar";
import { RxCaretSort } from "react-icons/rx";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";

function UserDetails({
  user,
  setCurrentSection,
  setSigninOptions,
}: {
  user: SigninOptions["user"];
  setCurrentSection: React.Dispatch<React.SetStateAction<SectionMapKeys>>;
  setSigninOptions: React.Dispatch<React.SetStateAction<SigninOptions | null>>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-row items-center justify-center gap-5 "
    >
      {user?.email && (
        <Avatar>
          <AvatarImage src={user?.image || getGravatar(user?.email)} />
          <AvatarFallback>{user?.name[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className="">
        <h1 className="line-clamp-1 text-xl font-medium">{user?.name}</h1>
        <h3 className="text-md  line-clamp-1 text-neutral-800 ">
          {user?.email}
        </h3>
      </div>
      <div>
        <Button
          variant={"subtle"}
          size="sm"
          onClick={() => {
            setSigninOptions(null);
            setCurrentSection("fetchsigninoptions");
          }}
        >
          <RxCaretSort className="text-xl text-inherit " />
        </Button>
      </div>
    </motion.div>
  );
}

export default UserDetails;
