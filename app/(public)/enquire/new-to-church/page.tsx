import EnquiryForm from '@/components/EnquiryForm'

export default function NewToChurch() {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' as const, required: true },
    { name: 'lastName', label: 'Last Name', type: 'text' as const, required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
    { name: 'gender', label: 'Gender', type: 'select' as const, required: true, options: ['Male', 'Female'] },
    { name: 'address', label: 'Address', type: 'textarea' as const, required: true },
    { name: 'membership', label: 'Are you becoming a member?', type: 'select' as const, required: true, options: ['Yes', 'No', 'Just Visiting'] },
  ]

  return (
    <EnquiryForm
      title="New to Church"
      description="We'd love to hear from you and welcome you to our community"
      fields={fields}
      submitMessage="Thank you for connecting with us! We'll be in touch soon to welcome you to Ebenezer Baptist Church."
      formType="new_to_church"
    />
  )
}
