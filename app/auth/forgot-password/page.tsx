import ForgotPassword from "@/components/ForgotPassword"
const page =  () => {
  return (
    <div className='flex items-center justify-center space-y-4 flex-col h-[70vh]'>
        <h1 className='text-heading-3'>Password Reset</h1>
        <p className='text-muted-foreground'>
           Please enter your email address to receive a password reset link.
        </p>
        <ForgotPassword/>
    </div>

  )
}

export default page