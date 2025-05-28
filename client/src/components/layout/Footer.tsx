import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          © 2024 Blog App. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
