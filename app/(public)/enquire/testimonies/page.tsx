import EnquiryForm from '@/components/EnquiryForm'

export default function Testimonies() {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' as const },
    { name: 'lastName', label: 'Last Name', type: 'text' as const },
    { name: 'phone', label: 'Phone Number', type: 'tel' as const },
    { name: 'body', label: 'Share Your Testimony', type: 'textarea' as const, required: true, placeholder: 'Tell us what God has done for you...' },
  ]

  return (
    <EnquiryForm
      title="Testimonies"
      description="Share your testimony and encourage our church community"
      fields={fields}
      submitMessage="Thank you for sharing your testimony! We praise God for what He has done in your life."
      formType="testimony"
    />
  )
}
