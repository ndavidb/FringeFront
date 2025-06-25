'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import {
    TextInput,
    Button,
    Text,
    Box,
    Title,
    Image,
    Flex,
    Container,
    useMantineTheme,
} from "@mantine/core";

import AboutSection from "@/app/(public)/(home)/components/AboutSection";
import ContactSection from "@/app/(public)/(home)/components/ContactSection";
import NewsletterSection from "@/app/(public)/(home)/components/NewsletterSection";
import QueryFormSection from "@/app/(public)/(home)/components/QueryFormSection";
import HeaderSection from "@/app/(public)/(home)/components/HeaderSection";

type Show = {
    showId: number;
    showName: string;
    description: string;
    venueName: string;
    showType: string;
    ageRestrictionCode: string;
    warningDescription: string;
    startDate: string;
    endDate: string;
    ticketTypeName: string;
    imagesUrl: string;
    videosUrl: string;
    active: boolean;
};

export default function HomePage() {
    const theme = useMantineTheme();
    const [shows, setShows] = useState<Show[]>([]);
    const [showCardsVisible, setShowCardsVisible] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [queryFormVisible, setQueryFormVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchResult, setIsSearchResult] = useState(false);


    const eventImages = [
        "/images/home/im.jpeg",
        "/images/home/imm.jpeg",
        "/images/home/immm.jpg",
        "/images/home/immmm.jpeg",
        "/images/home/immmmm.jpg",
        "/images/home/immmmmm.jpeg",
        "/images/home/immmmmmm.jpeg",
        "/images/home/immmmmmmm.jpg",
        "/images/home/immmmmmmmm.jpg",
        "/images/home/image.png",
    ];

    useEffect(() => {
        fetchInitialShows();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            fetchInitialShows();
        }
    }, [searchQuery]);

    const fetchInitialShows = () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/Shows`;
        fetch(url)
            .then((res) => res.json())
            .then((data: Show[]) => {
                const limited = data.slice(0, 8); // Show only 8 on homepage
                setShows(limited);
                setShowCardsVisible(true);
                setShowAll(false);
            })
            .catch((err) => console.error("Error loading homepage shows:", err));
    };

    const fetchUpcomingShows = () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/Shows`;
        fetch(url)
            .then((res) => res.json())
            .then((data: Show[]) => {
                setShows(data); // Show all shows
                setShowCardsVisible(true);
                setShowAll(true);
            })
            .catch((err) => console.error("Error fetching shows:", err));
    };

    const handleExploreToggle = () => {
        setShows([]);
        setIsSearchResult(false); 

        if (!showCardsVisible || !showAll) {
            fetchUpcomingShows();
        } else {
            setShowCardsVisible(false);
            setShowAll(false);
        }
    };


    const handleSeeAll = () => {
        fetchUpcomingShows();
    };

    const handleSearch = async () => {
        setShows([]);
        setShowCardsVisible(false);
        setIsSearchResult(false);

        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            alert("Please enter a show name to search.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/Shows`);
            const data: Show[] = await res.json();

            const matchedShows = data.filter(show =>
                show.showName && show.showName.toLowerCase().includes(query)
            );

            setShows(matchedShows);
            setShowCardsVisible(true);
            setShowAll(true);
            setIsSearchResult(true); 
        } catch (err) {
            console.error("Error during search:", err);
        }
    };



    return (
        <Box bg="white">
            {/* Header */}
            <HeaderSection />

            {/* Hero Section */}
            <Box
                style={{
                    backgroundImage: 'url("/images/admin/auth-layout.webp")',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px',
                    backgroundPosition: 'center',
                    paddingTop: '8rem',
                    paddingBottom: '8rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        zIndex: 1,
                    }}
                />
                <Container size="lg" style={{ zIndex: 2, position: 'relative' }}>
                    <Flex justify="center" align="center" direction="column">
                        <Title order={1} size={50} ta="center" c={theme.black} mb="md">
                            TELL US <br /> ABOUT YOUR
                        </Title>
                        <Title
                            order={1}
                            size={60}
                            ta="center"
                            c="pink.6"
                            fw={900}
                            lh={1.1}
                        >
                            FRINGE <br /> EXPERIENCE
                        </Title>
                        <Flex mt="lg" gap="md">
                            <Button color="purple" radius="md" fw={700} onClick={() => setQueryFormVisible(prev => !prev)}>
                                {queryFormVisible ? "Hide Query Form" : "Submit a Query"}
                            </Button>
                        </Flex>
                    </Flex>
                </Container>
            </Box>

            {/* Search Section */}
            <Box bg="#ffe9f5" py="lg" style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                <Container size="xl">
                    <Flex justify="center" align="center" wrap="wrap" gap="md">
                        <Box w={350}>
                            <TextInput
                                radius="xl"
                                size="md"
                                placeholder="Enter show name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                rightSectionWidth={90}
                                rightSection={
                                    <Button color="purple" size="sm" radius="xl" fw={700} onClick={handleSearch}>
                                        Search
                                    </Button>
                                }
                            />

                        </Box>
                    </Flex>
                </Container>
            </Box>

            {/* Explore Shows */}
            <Container size="xl" py="xl">
                <Flex justify="space-between" align="center" mb="md">
                    <Title order={2} fw={700} c="pink.6">
                        {showAll ? "All Shows" : (showCardsVisible ? "Featured Shows" : "Explore Shows")}
                    </Title>
                    <Flex gap="md">
                        {!isSearchResult && (
                            <Button color="purple" radius="md" onClick={handleExploreToggle}>
                                {showCardsVisible && showAll ? "Hide Shows" : "Explore Shows"}
                            </Button>
                        )}
                        {showCardsVisible && !showAll && (
                            <Button color="pink" variant="outline" radius="md" onClick={handleSeeAll}>
                                See All
                            </Button>
                        )}
                    </Flex>
                </Flex>

                {showCardsVisible && (
                    <>
                        {shows.length === 0 ? (
                            <Text mt="md" c="red" fw={600}>No shows found matching your search.</Text>
                        ) : (
                            <Flex wrap="wrap" gap="lg">
                                {shows.map((item, i) => (
                                    <Link
                                        key={item.showId}
                                        href={`/show/${item.showId}`}
                                        style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <Box
                                            w={260}
                                            bg="white"
                                            style={{
                                                border: "1px solid #ddd",
                                                borderRadius: 10,
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                transition: "transform 0.2s, box-shadow 0.2s",
                                            }}
                                        >
                                            <Image src={eventImages[i % eventImages.length]} height={160} alt={item.showName} />
                                            <Box p="sm">
                                                <Text size="xs" c="pink.6" fw={600}>{item.showType}</Text>
                                                <Text fw={700} mt={4}>{item.showName}</Text>
                                                <Text size="sm" mt={4} lineClamp={2}>{item.description}</Text>
                                                <Text size="xs" mt={6}>
                                                    🗓 {new Date(item.startDate).toLocaleDateString()} – {new Date(item.endDate).toLocaleDateString()}<br />
                                                    🎭 {item.venueName}<br />
                                                    🔞 {item.ageRestrictionCode}<br />
                                                    🎟 {item.ticketTypeName}
                                                </Text>
                                                {item.warningDescription && (
                                                    <Text size="xs" mt={4} c="red">⚠️ {item.warningDescription}</Text>
                                                )}
                                                {item.videosUrl && (
                                                    <Button
                                                        variant="light"
                                                        mt="xs"
                                                        color="blue"
                                                        size="xs"
                                                        fullWidth
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            window.open(item.videosUrl, "_blank");
                                                        }}
                                                    >
                                                        🎥 Watch Trailer
                                                    </Button>
                                                )}

                                            </Box>
                                        </Box>
                                    </Link>
                                ))}
                            </Flex>
                        )}
                    </>
                )}
            </Container>

            {/* Sections */}
            <NewsletterSection />
            <AboutSection />
            <ContactSection />
            {queryFormVisible && <QueryFormSection />}

            {/* FAQ */}
            <Flex justify="center" my="lg">
                <Button component={Link} href="/faq" variant="subtle" color="pink" size="md" fw={700}>
                    FREQUENTLY ASKED QUESTIONS (FAQ's)
                </Button>
            </Flex>

            {/* Footer */}
            <Box bg="black" py="xs" c="white">
                <Container size="xl">
                    <Text ta="center" fz="sm" mb="lg">
                        Adelaide Fringe recognises Kaurna Miyurna Yarta and all First Nations people...
                    </Text>
                    <Flex justify="space-between" wrap="wrap" gap="sm">
                        <Box>
                            <Text fw={700} mb="sm">Quick Links</Text>
                            <Flex gap="md">
                                <Image src="/images/home/fb logo.webp" width={24} height={24} alt="Facebook" />
                                <Image src="/images/home/insta.png" width={24} height={24} alt="Instagram" />
                                <Image src="/images/home/tiktok.jpg" width={24} height={24} alt="TikTok" />
                            </Flex>
                        </Box>
                    </Flex>
                    <Text size="xs" mt="lg" ta="center">
                        © Adelaide Fringe 2025
                    </Text>
                </Container>
            </Box>
        </Box>
    );
}
