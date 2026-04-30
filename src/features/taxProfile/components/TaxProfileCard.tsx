import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { Card } from '../../../components/ui/primitives/Card'
import { Button } from '../../../components/ui/primitives/Button'
import { DefinitionList } from '../../../components/ui/layout/DefinitionList'
import { Alert } from '../../../components/ui/overlays/Alert'
import { DetailDrawer } from '../../../components/ui/overlays/DetailDrawer'
import { useTaxProfile } from '../hooks/useTaxProfile'
import { useAdvisorOptions } from '@/features/users'
import { TaxProfileForm } from './TaxProfileForm'
import { TAX_PROFILE_FORM_ID, TAX_PROFILE_TEXT } from '../constants'
import { getTaxProfileItems } from '../helpers'
import type { TaxProfileCardProps } from '../types'

export const TaxProfileCard: React.FC<TaxProfileCardProps> = ({ clientId, readOnly = false }) => {
  const { profile, isLoading, error, updateProfile, isUpdating } = useTaxProfile(clientId ?? 0)
  const { nameById } = useAdvisorOptions(!readOnly)
  const [isEditing, setIsEditing] = useState(false)
  const closeEditor = () => setIsEditing(false)

  return (
    <>
      <Card title={TAX_PROFILE_TEXT.title} subtitle={TAX_PROFILE_TEXT.subtitle}>
        {isLoading && <p className="py-2 text-sm text-gray-500">{TAX_PROFILE_TEXT.loading}</p>}

        {error && <Alert variant="error" message={error} />}

        {!isLoading && !error && (
          <div className="space-y-4">
            <DefinitionList items={getTaxProfileItems(profile, nameById)} columns={2} />
            {!readOnly && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {TAX_PROFILE_TEXT.edit}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <DetailDrawer
        open={isEditing}
        title={TAX_PROFILE_TEXT.editTitle}
        onClose={closeEditor}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={closeEditor} disabled={isUpdating}>
              {TAX_PROFILE_TEXT.cancel}
            </Button>
            <Button
              type="submit"
              form={TAX_PROFILE_FORM_ID}
              variant="primary"
              isLoading={isUpdating}
              disabled={isUpdating}
            >
              {TAX_PROFILE_TEXT.saveChanges}
            </Button>
          </div>
        }
      >
        <TaxProfileForm
          profile={profile}
          onSave={(data) => {
            updateProfile(data)
            closeEditor()
          }}
          onCancel={closeEditor}
          isSaving={isUpdating}
          hideFooter
          formId={TAX_PROFILE_FORM_ID}
        />
      </DetailDrawer>
    </>
  )
}
