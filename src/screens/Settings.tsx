import { Component } from "solid-js";
import {Link} from "@solidjs/router";
import {Button} from "@suid/material";

const HomeScreen: Component = () => {

  return (
      <div class={"container"}>
          <Link href={"/"}>
            <Button>Settings Page</Button>
          </Link>
      </div>
  );
};

export default HomeScreen;
