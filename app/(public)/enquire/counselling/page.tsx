import EnquiryForm from '@/components/EnquiryForm'

export default function Counselling() {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' as const, required: true },
    { name: 'lastName', label: 'Last Name', type: 'text' as const, required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
    { name: 'body', label: 'How can we help you?', type: 'textarea' as const, required: true, placeholder: 'Please share what you would like counseling about...' },
  ]

  return (
    <EnquiryForm
      title="Counselling"
      description="Request confidential pastoral counseling and support"
      fields={fields}
      submitMessage="Your request has been received. A pastor will contact you shortly to arrange a counseling session."
      formType="counselling"
    />
  )
}
