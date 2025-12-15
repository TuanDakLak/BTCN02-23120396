import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useAuth } from "./Logging/AuthContext";
import { User, Mail, Phone, Calendar, Save } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gọi API update profile
    console.log("Update profile:", formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="text-2xl">Hồ sơ cá nhân</CardTitle>
          <CardDescription className="text-blue-100">
            Quản lý thông tin tài khoản của bạn
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {user?.username}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Thành viên</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Thông tin cá nhân
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Tên đăng nhập
                        </Label>
                        <Input
                          id="username"
                          value={user?.username || ""}
                          disabled
                          className="bg-gray-50 dark:bg-gray-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        ) : (
                          <Input
                            id="email"
                            value={formData.email || "Chưa cập nhật"}
                            disabled
                            className="bg-gray-50 dark:bg-gray-900"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Số điện thoại
                        </Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        ) : (
                          <Input
                            id="phone"
                            value={formData.phone || "Chưa cập nhật"}
                            disabled
                            className="bg-gray-50 dark:bg-gray-900"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dob" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Ngày sinh
                        </Label>
                        {isEditing ? (
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          />
                        ) : (
                          <Input
                            id="dob"
                            value={formData.dob || "Chưa cập nhật"}
                            disabled
                            className="bg-gray-50 dark:bg-gray-900"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button type="submit" className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Lưu thay đổi
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        Chỉnh sửa thông tin
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}