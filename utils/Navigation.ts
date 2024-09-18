import { router } from 'expo-router';
import { Routes, RouteParams } from './Routes';

class Navigation {
  private beforeNavigateCallbacks: Array<(path: string) => Promise<boolean> | boolean> = [];
  private afterNavigateCallbacks: Array<(path: string) => void> = [];

  // Register a middleware function to execute before navigation
  public onBeforeNavigate(callback: (path: string) => Promise<boolean> | boolean) {
    this.beforeNavigateCallbacks.push(callback);
  }

  // Register a middleware function to execute after navigation
  public onAfterNavigate(callback: (path: string) => void) {
    this.afterNavigateCallbacks.push(callback);
  }

  // Internal method to execute before navigation middleware
  private async executeBeforeNavigate(path: string): Promise<boolean> {
    for (const callback of this.beforeNavigateCallbacks) {
      const result = await callback(path);
      if (result === false) {
        return false;
      }
    }
    return true;
  }

  // Internal method to execute after navigation middleware
  private executeAfterNavigate(path: string) {
    for (const callback of this.afterNavigateCallbacks) {
      callback(path);
    }
  }

  // Navigate to a specific route
  public async go<T extends Routes>(
    route: T,
    params?: RouteParams[T]
  ): Promise<void> {
    let path = route as string;

    if (params) {
      Object.keys(params).forEach((key) => {
        path = path.replace(`:${key}`, encodeURIComponent((params as any)[key]));
      });
    }

    const canNavigate = await this.executeBeforeNavigate(path);
    if (canNavigate) {
      router.push(path);
      this.executeAfterNavigate(path);
    }
  }

  // Navigate back to the previous screen
  public back(): void {
    router.back();
  }
}

const navigation = new Navigation();
export default navigation;