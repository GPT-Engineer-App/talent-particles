import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Input, Button, VStack, HStack, Tag, Image, useToast } from "@chakra-ui/react";
import { FaSearch, FaEnvelope } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [developers, setDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    const data = await client.getWithPrefix("developer:");
    if (data) {
      setDevelopers(data.map((d) => ({ ...d.value, id: d.key })));
      setFilteredDevelopers(data.map((d) => ({ ...d.value, id: d.key })));
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredDevelopers(developers);
    } else {
      const filtered = developers.filter((dev) => dev.name.toLowerCase().includes(term) || dev.location.toLowerCase().includes(term) || dev.technologies.some((tech) => tech.toLowerCase().includes(term)));
      setFilteredDevelopers(filtered);
    }
  };

  const sendMessage = (developer) => {
    toast({
      title: `Message sent to ${developer.name}`,
      description: "We've sent your message to the developer.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={5}>
      <VStack spacing={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to Particles
        </Text>
        <Text fontSize="lg">Discover top software talent specialized in web technologies.</Text>
        <Input placeholder="Search by name, location, or technology..." value={searchTerm} onChange={handleSearch} size="lg" leftIcon={<FaSearch />} />
        <VStack spacing={4} align="stretch">
          {filteredDevelopers.map((dev) => (
            <Flex key={dev.id} p={4} boxShadow="md" borderRadius="md" align="center" justify="space-between">
              <VStack align="start">
                <Text fontWeight="bold">{dev.name}</Text>
                <Text>{dev.location}</Text>
                <HStack spacing={2}>
                  {dev.technologies.map((tech) => (
                    <Tag key={tech} size="sm" colorScheme="blue">
                      {tech}
                    </Tag>
                  ))}
                </HStack>
              </VStack>
              <Button leftIcon={<FaEnvelope />} colorScheme="teal" onClick={() => sendMessage(dev)}>
                Message
              </Button>
            </Flex>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Index;
