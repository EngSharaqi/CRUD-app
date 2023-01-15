import { Circle, BookOpen } from "react-feather"
export default [
    {
        id: "products",
        title: "Products",
        icon: <BookOpen size={20} />,
        badge: 'light-warning',
        badgeText: '2',
        children: [
          {
            id: 'productsCategory',
            title: 'Category',
            icon: <Circle size={12} />,
            navLink: '/products/category'
          },
        ]
      },
    
]