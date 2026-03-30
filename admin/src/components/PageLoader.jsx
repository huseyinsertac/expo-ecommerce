import { Loader } from 'lucide-react';

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin size-12" />
    </div>
  );
}

export default PageLoader;
