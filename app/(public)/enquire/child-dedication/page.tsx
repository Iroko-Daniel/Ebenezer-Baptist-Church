import EnquiryForm from '@/components/EnquiryForm'

export default function ChildDedication() {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' as const, required: true },
    { name: 'lastName', label: 'Last Name', type: 'text' as const, required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
    { name: 'body', label: 'Tell us about your child and dedication preferences', type: 'textarea' as const, required: true, placeholder: 'Please share your child\'s name, age, and preferred dedication date...' },
  ]

  return (
    <EnquiryForm
      title="Child Dedication"
      description="Dedicate your child to the Lord in a special ceremony"
      fields={fields}
      submitMessage="Your child dedication request has been received. We will contact you to confirm the date and provide further details."
      formType="child_dedication"
    />
  )
}
