'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Button, Input } from '@/components/ui';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody } from '../ui/Modal';
import { useTagStore } from '@/store/tags';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const TagsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 300px;
  overflow-y: auto;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const TagPreview = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const TagColorDot = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.background.primary};
`;

const TagName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TagActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

const CreateTagForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.background.primary};
  
  &::-webkit-color-swatch-wrapper {
    padding: 2px;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageTagsModal = ({ isOpen, onClose }: ManageTagsModalProps) => {
  const tags = useTagStore((state) => state.tags);
  const addTag = useTagStore((state) => state.addTag);
  const updateTag = useTagStore((state) => state.updateTag);
  const deleteTag = useTagStore((state) => state.deleteTag);

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
      setNewTagColor('#3b82f6');
    }
  };

  const handleStartEdit = (tagId: string, tagName: string, tagColor: string) => {
    setEditingTagId(tagId);
    setEditTagName(tagName);
    setEditTagColor(tagColor);
  };

  const handleSaveEdit = () => {
    if (editingTagId && editTagName.trim()) {
      updateTag(editingTagId, { name: editTagName.trim(), color: editTagColor });
      setEditingTagId(null);
      setEditTagName('');
      setEditTagColor('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditTagName('');
    setEditTagColor('');
  };

  const handleDeleteTag = (tagId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este tag? Se eliminará de todas las tareas.')) {
      deleteTag(tagId);
    }
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay onClick={onClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Tags setting</ModalTitle>
              <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <ContentWrapper>
        <Section>
          <SectionTitle>Create new tag</SectionTitle>
          <CreateTagForm>
            <FormRow>
              <InputGroup style={{ flex: 2 }}>
                <Label htmlFor="tag-name">Name</Label>
                <Input
                  id="tag-name"
                  type="text"
                  placeholder="Tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateTag();
                    }
                  }}
                />
              </InputGroup>
              <InputGroup style={{ flex: 1 }}>
                <Label htmlFor="tag-color">Color</Label>
                <ColorInput
                  id="tag-color"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                />
              </InputGroup>
              <Button variant="primary" size="md" onClick={handleCreateTag}>
                Create tag
              </Button>
            </FormRow>
          </CreateTagForm>
        </Section>

        <Section>
          <SectionTitle>Tags ({tags.length})</SectionTitle>
          <TagsList>
            {tags.length === 0 ? (
              <EmptyState>
                No tags created. Create your first tag above.
              </EmptyState>
            ) : (
              tags.map((tag) => (
                <TagItem key={tag.id}>
                  {editingTagId === tag.id ? (
                    <>
                      <InputGroup style={{ flex: 2 }}>
                        <Input
                          type="text"
                          value={editTagName}
                          onChange={(e) => setEditTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit();
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          autoFocus
                        />
                      </InputGroup>
                      <InputGroup style={{ flex: 1 }}>
                        <ColorInput
                          type="color"
                          value={editTagColor}
                          onChange={(e) => setEditTagColor(e.target.value)}
                        />
                      </InputGroup>
                      <TagActions>
                        <IconButton onClick={handleSaveEdit} title="Guardar">
                          ✓
                        </IconButton>
                        <IconButton onClick={handleCancelEdit} title="Cancelar">
                          ✕
                        </IconButton>
                      </TagActions>
                    </>
                  ) : (
                    <>
                      <TagPreview $color={tag.color}>
                        <TagColorDot $color={tag.color} />
                        <TagName>{tag.name}</TagName>
                      </TagPreview>
                      <TagActions>
                        <IconButton
                          onClick={() => handleStartEdit(tag.id, tag.name, tag.color)}
                          title="Edit"
                        >
                          ✏️
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteTag(tag.id)}
                          title="Delete"
                        >
                          🗑️
                        </IconButton>
                      </TagActions>
                    </>
                  )}
                </TagItem>
              ))
            )}
          </TagsList>
        </Section>

        <FooterWrapper>
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
        </FooterWrapper>
      </ContentWrapper>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export { ManageTagsModal };
