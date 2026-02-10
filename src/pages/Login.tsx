import React from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md" title="כניסה למערכת">
        <div className="space-y-4">
          <Input label="דוא״ל" type="email" placeholder="הכנס כתובת דוא״ל" />
          <Input label="סיסמה" type="password" placeholder="הכנס סיסמה" />
          <Button className="w-full" type="button">
            כניסה
          </Button>
          <p className="text-xs text-gray-500 text-center">
            מסך ראשוני בלבד - ללא שליחת נתונים בספרינט 1
          </p>
        </div>
      </Card>
    </div>
  );
};
