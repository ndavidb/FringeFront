"use client";

import {
  Box,
  Container,
  Flex,
  Image,
  Group,
  Text,
  Title,
  Button,
  Grid,
  Center
} from '@mantine/core';
import Link from 'next/link';

export default function PlannerPage() {
  // const theme = useMantineTheme();

  return (
    <Box bg="white">
      {/* TOP NAVBAR */}
      <Box
        style={{
          height: 80,
          borderBottom: '1px solid #eee',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl" style={{ height: '100%' }}>
          <Flex justify="space-between" align="center" style={{ height: '100%' }}>
            <Image src="/images/main-logo.svg" alt="Adelaide Fringe Logo" width={180} />
            <Group gap="lg">
  <Link href="/#about" passHref legacyBehavior>
    <Text component="a" fw={700} fz="md" c="pink.6" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
      About Us
    </Text>
  </Link>
  <Link href="/#contact" passHref legacyBehavior>
    <Text component="a" fw={700} fz="md" c="pink.6" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
      Contact Us
    </Text>
  </Link>
</Group>
          </Flex>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container size="xl" px="md" py="xl">
        <Grid gutter="xl" align="start">
          {/* LEFT COLUMN */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Flex direction="column" gap="sm">
              <Title order={2}>Design Your Perfect Fringe Adventure!</Title>
              <Text>
                First things first: Your Shortlist is your best friend here. If you haven&apos;t 
                started adding shows to your Shortlist yet, that&apos;s your first move – go explore 
                and come back with some gems!
              </Text>
              <Text>
                Here&apos;s how to turn your Shortlist into an amazing festival schedule:
              </Text>

              <Flex direction="column" gap="md">
                {[
                  {
                    title: 'Step 1: Choose Your Showtimes',
                    desc: `Browse through your top picks and select the sessions that best suit your vibe and schedule. 
                    Think of it like crafting your very own entertainment puzzle — one piece at a time.!`,
                  },
                  {
                    title: 'Step 2: Find your perfect fit',
                    desc: `Have a long list? No problem. Use our smart filters to quickly spot what’s on when you’re free. 
                    No more guesswork — we’ll help you align your shows perfectly with your availability.

`,
                  },
                  {
                    title: 'Step 3: Shape your festival',
                    desc: `This is your festival, your way. Mix, match, shuffle — arrange your schedule until it feels just right.
                     Whether you're after a slow roll or full-throttle fun, you're in control.`,
                  },
                  {
                    title: 'Step 4:  Lock It In',
                    desc: `This is your festival, your way. Mix, match, shuffle — arrange your schedule until it feels just right. 
                    Whether you're after a slow roll or full-throttle fun, you're in control.`,
                  },
                ].map((step, index) => (
                  <Flex key={index} direction="column" gap={4}>
                    <Title order={4}>{step.title}</Title>
                    <Text>{step.desc}</Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Grid.Col>

          {/* RIGHT COLUMN */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Flex direction="column" gap="md">
              <Title order={3}>Curate your perfect fringe experience</Title>
              <Text>
                Discover, shortlist, and plan your must-see shows with your MyFringe planner. 
                Your personal festival guide starts here.
              </Text>
              <Center>
                <Image 
                  src="/images/home/planner.jpg" 
                  alt="Planner character" 
                  width={375} 
                  height={375} 
                />
              </Center>
              {/* ✅ Login button*/}
              <Link href="/User/login" passHref legacyBehavior>
              <Center>
                <Button size="lg" color="pink">LOG IN</Button>
              </Center>
              </Link>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
