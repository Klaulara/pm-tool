import React from 'react';
import { Flex, Input, Button } from './ui';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsCreateModalOpen: (isOpen: boolean) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery, setIsCreateModalOpen }: SearchBarProps) => {
    return (
        <Flex gap="md">
            <div style={{ flex: 1 }}>
                <Input
                    type="text"
                    placeholder="🔍 Find boards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    $fullWidth
                    size="lg"
                />
            </div>
            <Button variant="primary" size="lg" onClick={() => setIsCreateModalOpen(true)}>
                <span>➕</span> New Board
            </Button>
        </Flex>

    )
}

export default SearchBar