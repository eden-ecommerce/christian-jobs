"use client";

import {
  HelpCircle,
  Phone,
  ShoppingBasket,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { IconWithText } from "@eden-ecommerce/common/blocks/Header";
import { SANITY_LINKS } from "@/data/sanity-defaults";

type SanityHeaderActionsProps = {
  phoneNumber: string;
  mobileNavSlot: ReactNode;
};

export const SanityHeaderActions = ({
  phoneNumber,
  mobileNavSlot,
}: SanityHeaderActionsProps) => {
  return (
    <>
      <li className="hidden md:block">
        <IconWithText
          heading="Help"
          icon={<HelpCircle className="size-7" />}
          textLocation="bottom"
          ariaLabel="help"
          link={SANITY_LINKS.headerHelp}
        />
      </li>
      <li className="md:hidden">
        <IconWithText
          heading="Call"
          icon={<Phone className="size-7" />}
          textLocation="bottom"
          ariaLabel="phone"
          link={`tel:${phoneNumber}`}
        />
      </li>
      <li>
        <IconWithText
          heading="Login"
          icon={<User className="size-7" />}
          textLocation="bottom"
          ariaLabel="login"
          link={SANITY_LINKS.accountLogin}
        />
      </li>
      <li>
        <IconWithText
          heading="Basket"
          icon={<ShoppingBasket className="size-7" />}
          textLocation="bottom"
          ariaLabel="basket"
          link={SANITY_LINKS.basket}
        />
      </li>
      <li className="md:hidden">{mobileNavSlot}</li>
    </>
  );
};
