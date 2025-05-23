import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AppContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #000;
  min-height: 100vh;
`;

const StoriesContainer = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 20px 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoryItem = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #ff4d4d;
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LiveBadge = styled(motion.div)`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff4d4d;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const StoryViewer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const StoryContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StoryMedia = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const App = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  
  const stories = [
    { id: 1, image: 'https://via.placeholder.com/80', isLive: true },
    { id: 2, image: 'https://via.placeholder.com/80', isLive: false },
    { id: 3, image: 'https://via.placeholder.com/80', isLive: true },
    // Добавьте больше историй по необходимости
  ];

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleCloseStory = () => {
    setSelectedStory(null);
  };

  return (
    <AppContainer>
      <StoriesContainer>
        {stories.map((story) => (
          <StoryItem key={story.id} onClick={() => handleStoryClick(story)}>
            <StoryImage src={story.image} alt={`Story ${story.id}`} />
            {story.isLive && (
              <LiveBadge
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                LIVE
              </LiveBadge>
            )}
          </StoryItem>
        ))}
      </StoriesContainer>

      {selectedStory && (
        <StoryViewer>
          <CloseButton onClick={handleCloseStory}>×</CloseButton>
          <StoryContent>
            <StoryMedia src={selectedStory.image} alt="Story content" />
          </StoryContent>
        </StoryViewer>
      )}
    </AppContainer>
  );
};

export default App; 