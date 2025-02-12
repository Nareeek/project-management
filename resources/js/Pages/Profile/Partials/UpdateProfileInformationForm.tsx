import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', data.name || user.name); // Use existing value if empty
        formData.append('email', data.email || user.email); // Use existing value if empty
    
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
    
        patch(route('profile.update'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                // ✅ Refresh the avatar preview after saving
                if (data.avatar) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const newAvatarUrl = e.target?.result as string;
                        setData('avatar', newAvatarUrl);
                    };
                    reader.readAsDataURL(data.avatar);
                }
            },
        });
    };
    

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="avatar" value="Avatar" />
                    
                    {/* ✅ Show Current Avatar */}
                    <img 
                        src={user.avatar ? `/storage/${user.avatar}` : `/images/default-avatar.png`} 
                        className="w-16 h-16 rounded-full mb-2"
                        alt="User Avatar"
                    />

                    {/* ✅ File Input to Upload New Avatar */}
                    <input 
                        id="avatar"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('avatar', e.target.files[0])}
                    />

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
