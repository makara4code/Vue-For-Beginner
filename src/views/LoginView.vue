<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
    try {
        await authStore.login({ email: email.value, password: password.value });
        router.push('/dashboard');
    } catch (error) {
        errorMessage.value = 'Login failed. Please check your credentials and try again.';
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen">
        <Card class="w-full max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
                <Label for="email">Email</Label>
                <Input id="email" v-model="email" type="email" />
                <Label for="password" class="mt-4">Password</Label>
                <Input id="password" v-model="password" type="password" />
            </CardContent>
            <CardFooter>
                <Button @click="login">Login</Button>
            </CardFooter>
        </Card>
    </div>
</template>