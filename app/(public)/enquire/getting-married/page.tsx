import EnquiryForm from '@/components/EnquiryForm'

export default function GettingMarried() {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' as const, required: true },
    { name: 'lastName', label: 'Last Name', type: 'text' as const, required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
    { name: 'body', label: 'Tell us about your wedding plans', type: 'textarea' as const, required: true, placeholder: 'Please share your wedding date, preferences, and how we can support you...' },
  ]

  return (
    <EnquiryForm
      title="Getting Married"
      description="Plan your special day with us. We'd love to be part of your wedding journey."
      fields={fields}
      submitMessage="Thank you for considering Ebenezer Baptist Church for your wedding. Our pastoral team will contact you to discuss next steps."
      formType="getting_married"
    />
  )
}
