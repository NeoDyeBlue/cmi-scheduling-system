import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { MoonLoader } from 'react-spinners';

export default function SpinnerLoader({ size }) {
  const { theme } = resolveConfig(tailwindConfig);
  return (
    <MoonLoader
      className="mx-auto"
      size={size}
      color={theme.colors.primary[500]}
    />
  );
}
