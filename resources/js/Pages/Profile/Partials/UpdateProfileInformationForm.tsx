import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Notification from '@/Components/Notification';
import { FormEventHandler, useState } from 'react';
import axios from 'axios';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    onProfileUpdate,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    onProfileUpdate: (user: any) => void;
}) {
    const user = usePage().props.auth.user;

    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar ? `/storage/${user.avatar}` : '/images/default-avatar.png',

      );
    const [notification, setNotification] = useState(null);


    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        });

    const hasChanged =
        data.name !== user.name ||
        data.email !== user.email ||
        (data.avatar instanceof File);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);


        if (data.avatar && data.avatar instanceof File) {
            formData.append('avatar', data.avatar);
        }

        // Include method override for PATCH
        formData.append('_method', 'PATCH');

        try {
            const response = await axios.post(route('profile.update'), formData);

            // Update the local avatar preview in case the server returns a new file path
            setAvatarPreview(
                response.data.user.avatar
                    ? `/storage/${response.data.user.avatar}`
                    : '/images/default-avatar.png'
            );

            if (typeof onProfileUpdate === 'function') {
                onProfileUpdate(response.data.user);
              }

        setNotification({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Profile update failed!', type: 'error' });
        }
    };
    

    return (
        <section className={className}>
            {notification && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification(null)}
                />
             )}
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
                    
                    <img 
                        src={avatarPreview}
                        onError={(e) => e.currentTarget.src = '/images/default-avatar.png'}
                        className="w-60 h-60 rounded object-cover border border-gray-300 shadow-md"
                        alt="User Avatar"
                    />

                    <input 
                        id="avatar"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file && file instanceof File) {
                                setData('avatar', file);
                                setAvatarPreview(URL.createObjectURL(file));
                            } else {
                                console.error('The selected item is not a valid file.');
                                alert("Not a valid file");
                            }
                        }}
                    />

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || !hasChanged}>
                        Save
                    </PrimaryButton>

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
