import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { RegisterInput, registerSchema } from '@/utils/types';

export default function Register() {
  const { isLoading, register: registerUser } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  async function onSubmit(data: RegisterInput) {
    try {
      registerSchema.safeParse(data);
      // TODO: Implement toast and parse check
      await registerUser(data);
      router.replace('/login');
    } catch (error) {
      console.error('Registration failed: ', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="First Name" value={value} onChangeText={onChange} style={styles.input} />
        )}
      />
      {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Last Name" value={value} onChangeText={onChange} style={styles.input} />
        )}
      />
      {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={styles.input}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Controller
        control={control}
        name="language"
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Preferred Language" value={value} onChangeText={onChange} style={styles.input} />
        )}
      />
      {errors.language && <Text style={styles.error}>{errors.language.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Create account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, marginBottom: 12 },
  input: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#2b6cb0', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 12, color: '#2b6cb0', textAlign: 'center' },
  error: { color: 'crimson', marginBottom: 8 },
});
