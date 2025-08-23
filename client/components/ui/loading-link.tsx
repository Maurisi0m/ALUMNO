import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/hooks/use-loading";

interface LoadingLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingLink({ to, children, className, onClick }: LoadingLinkProps) {
  const navigate = useNavigate();
  const { loadingWithDuration } = useLoading();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Execute custom onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Show loading animation
    await loadingWithDuration(1400);
    
    // Navigate to the target route
    navigate(to);
  };

  return (
    <div onClick={handleClick} className={className} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
}
