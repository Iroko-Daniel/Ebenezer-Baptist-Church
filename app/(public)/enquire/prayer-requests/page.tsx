import EnquiryForm from '@/components/EnquiryForm'

export default function PrayerRequests() {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' as const, required: true },
    { name: 'lastName', label: 'Last Name', type: 'text' as const, required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
    { name: 'prayerRequest', label: 'Your Prayer Request', type: 'textarea' as const, required: true, placeholder: 'Share your prayer request here...' },
  ]

  return (
    <EnquiryForm
      title="Prayer Requests"
      description="Submit your prayer requests and our team will pray with you"
      fields={fields}
      submitMessage="Your prayer request has been received. Our prayer team will be interceding on your behalf."
      formType="prayer_request"
    />
  )
}
