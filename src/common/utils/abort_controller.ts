// Controladores por clave
const controllers: Record<string, AbortController> = {};

// Helper para crear/abortar peticiones previas
const createAbortableRequest = (key: string): AbortSignal => {
  if (controllers[key]) {
    controllers[key].abort();
  }
  const controller = new AbortController();
  controllers[key] = controller;
  return controller.signal;
};
export { createAbortableRequest, controllers };