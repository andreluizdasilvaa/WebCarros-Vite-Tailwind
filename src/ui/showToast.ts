import { toast, Bounce } from 'react-toastify';
import type { ToastOptions, TypeOptions } from 'react-toastify';

// Configurações padrão para os toasts
const defaultConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};

export const showSuccessToast = (message: string, options: ToastOptions = {}) => {
  toast.success(message, {
    ...defaultConfig,
    ...options,
  });
};

export const showErrorToast = (message: string, options: ToastOptions = {}) => {
  toast.error(message, {
    ...defaultConfig,
    ...options,
  });
};

export const showInfoToast = (message: string, options: ToastOptions = {}) => {
  toast.info(message, {
    ...defaultConfig,
    ...options,
  });
};

export const showWarningToast = (message: string, options: ToastOptions = {}) => {
  toast.warning(message, {
    ...defaultConfig,
    ...options,
  });
};

export const showCustomToast = (
  message: string,
  type: TypeOptions = 'info',
  options: ToastOptions = {}
) => {
  const toastTypes: Record<TypeOptions, (msg: string, opts?: ToastOptions) => void> = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    default: toast, // usado caso um tipo inválido seja passado
  };

  const toastFunction = toastTypes[type] || toast.info;

  toastFunction(message, {
    ...defaultConfig,
    ...options,
  });
};

/**
 * Configurações específicas para diferentes cenários
 */
export const toastConfigs: Record<
  'quick' | 'long' | 'persistent' | 'light' | 'bottom' | 'center',
  Partial<ToastOptions>
> = {
  quick: { autoClose: 2000 },
  long: { autoClose: 8000 },
  persistent: { autoClose: false },
  light: { theme: "light" },
  bottom: { position: "bottom-right" },
  center: { position: "top-center" },
};

// Exemplo de uso:
// showSuccessToast("Usuário cadastrado com sucesso!");
// showErrorToast("Erro ao fazer login", toastConfigs.long);
// showInfoToast("Processando...", toastConfigs.persistent);
