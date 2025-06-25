"use client";
import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import {
  Box,
  Collapse,
  Group,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import classes from "./NavbarLinksGroup.module.css";
import Link from "next/link";

interface LinksGroupProps {
  icon: React.FC<{ size?: number }>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?: string;
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = (hasLinks ? links : []).map((link) => (
    <Link
      href={link.link}
      key={link.label}
      className={classes.link}
      style={{ display: "block" }}
    >
      {link.label}
    </Link>
  ));

  if (link) {
    return (
      <Link href={link} style={{ textDecoration: "none" }}>
        <UnstyledButton className={classes.control}>
          <Group justify="space-between" gap={0}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="filled" size={28} color="pink.8">
                <Icon size={20} />
              </ThemeIcon>
              <Box ml="sm" fz="md">
                {label}
              </Box>
            </Box>
          </Group>
        </UnstyledButton>
      </Link>
    );
  }

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="filled" size={28} color="pink.8">
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="sm" fz="md">
              {label}
            </Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={18}
              style={{
                transform: opened ? "rotate(-90deg)" : "none",
                transition: "transform 200ms ease",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
