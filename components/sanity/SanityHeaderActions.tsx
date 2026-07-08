"use client";

import {
  ShoppingBasket,
  User,
} from "lucide-react";
import { IconWithText } from "@eden-ecommerce/common/blocks/Header";
import { SANITY_LINKS } from "@/data/sanity-defaults";

export const SanityHeaderActions = () => {
  return (
    <>
      <li>
        <IconWithText
          heading="Login"
          icon={<User className="size-5" />}
          textLocation="bottom"
          ariaLabel="Login"
          link={SANITY_LINKS.accountLogin}
        />
      </li>
      <li>
        <IconWithText
          heading="Basket"
          icon={<ShoppingBasket className="size-5" />}
          textLocation="bottom"
          ariaLabel="Basket"
          link={SANITY_LINKS.basket}
        />
      </li>
    </>
  );
};
