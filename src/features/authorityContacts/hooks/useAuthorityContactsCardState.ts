import { useState } from 'react'
import type { AuthorityContactResponse } from '../api'

export const useAuthorityContactsCardState = () => {
  const [editing, setEditing] = useState<AuthorityContactResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const openCreate = () => {
    setEditing(null)
    setIsModalOpen(true)
  }

  const openEdit = (contact: AuthorityContactResponse) => {
    setEditing(contact)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditing(null)
    setIsModalOpen(false)
  }

  return {
    editing,
    isModalOpen,
    confirmDeleteId,
    openCreate,
    openEdit,
    closeModal,
    requestDelete: setConfirmDeleteId,
    clearDeleteRequest: () => setConfirmDeleteId(null),
  }
}
